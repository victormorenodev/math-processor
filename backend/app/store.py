import uuid
from .models import ProcessRequest, RequestStatus

_requests: dict[str, ProcessRequest] = {}

def create(numbers: list[float]) -> ProcessRequest:
    request = ProcessRequest(
        id=str(uuid.uuid4()),
        status="pending",
        progress=0,
        logs=["Request created"],
        result=None,
    )
    _requests[request.id] = request
    return request

def get(id: str) -> ProcessRequest | None:
    return _requests[id] if id in _requests else None

def get_all() -> list[ProcessRequest]:
    return list(_requests.values())

def update(
    id: str,
    *, # force named fields
    status: RequestStatus | None = None,
    progress: int | None = None,
    result: int | None = None,
) -> None:
    request = get(id)
    if request is None:
        return
    if status is not None:
        request.status = status
    if progress is not None:
        request.progress = progress
    if result is not None:
        request.result = result

def append_log(id: str, message: str) -> None:
    request = get(id)
    if request is None:
        return
    request.logs.append(message)