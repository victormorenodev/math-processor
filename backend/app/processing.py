import asyncio
from . import store
from .models import ProcessRequest

_tasks: dict[str, asyncio.Task] = {}

class RequestNotFound(Exception):
    pass

class RequestAlreadyFinished(Exception):
    pass

def start(numbers: list[int]) -> ProcessRequest:
    request = store.create(numbers)
    task = asyncio.create_task(process(request.id, numbers))
    _tasks[request.id] = task
    return request

def cancel(request_id: str) -> ProcessRequest:
    request = store.get(request_id)
    if request is None:
        raise RequestNotFound()
    if request.status in ("completed", "error"):
        raise RequestAlreadyFinished()

    task = _tasks.get(request_id)
    if task is not None:
        task.cancel()

    store.update(request_id, status="error")
    store.append_log(request_id, "Cancelled by user.")
    return store.get(request_id)

async def process(request_id: str, numbers: list[int]) -> None:
    try:
        store.update(request_id, status="processing", progress=0)
        store.append_log(request_id, "Starting processing...")

        await asyncio.sleep(3)
        store.append_log(request_id, "Validating data...")
        store.update(request_id, progress=30)

        # semantic validation
        # we will not accept negative numbers
        if any(number < 0 for number in numbers):
            store.update(request_id, status="error")
            store.append_log(request_id, "Invalid number in the list.")
            return

        await asyncio.sleep(5)
        store.append_log(request_id, "Calculating sum...")
        store.update(request_id, progress=70)
        result = sum(numbers)

        store.update(request_id, status="completed", progress=100, result=result)
        store.append_log(request_id, "Finished successfully.")
    except asyncio.CancelledError:
        request = store.get(request_id)
        if request is not None and request.status != "error":
            store.update(request_id, status="error")
            store.append_log(request_id, "Cancelled.")
        raise