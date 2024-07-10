from pydantic import BaseModel

class Note(BaseModel):
    value: str
    checked: bool
    strikethrough: bool
