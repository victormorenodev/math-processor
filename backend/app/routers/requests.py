from fastapi import APIRouter, HTTPException
from .. import store, processing
from ..models import ProcessRequest, CreateRequestPayload

router = APIRouter()

@router.post("/requests")
async def create_request(payload: CreateRequestPayload) -> ProcessRequest:
    return processing.start(payload.numbers)

@router.get("/requests")
def list_requests() -> list[ProcessRequest]:
    return store.get_all()

@router.delete("/requests")
async def clear_requests() -> dict[str, str]:
    processing.clear_all()
    return {"detail": "All requests cleared"}

@router.get("/requests/{request_id}")
def get_request(request_id: str) -> ProcessRequest:
    request = store.get(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

@router.post("/requests/{request_id}/cancel")
async def cancel_request(request_id: str) -> ProcessRequest:
    try:
        return processing.cancel(request_id)
    except processing.RequestNotFound:
        raise HTTPException(status_code=404, detail="Request not found")
    except processing.RequestAlreadyFinished:
        raise HTTPException(status_code=409, detail="Request already finished, cannot cancel")