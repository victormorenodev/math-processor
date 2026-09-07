from typing import Literal
from pydantic import BaseModel, Field

RequestStatus = Literal["pending", "processing", "completed", "error"]

class ProcessRequest(BaseModel):
    id: str
    status: RequestStatus
    progress: int
    logs: list[str]
    result: int | None

class CreateRequestPayload(BaseModel):
    numbers: list[int] = Field(min_length=1)
