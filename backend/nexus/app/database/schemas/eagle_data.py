# :: Company wide ::
from pydantic import BaseModel

"""
All schema for `eagle-data` collection
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""

"""
list of communities,
list of eagle departments,
Things like this belong in this collection. but as of now since the above two
are just a list of strings, i am not creating any schema(types). but in the 
future when adding more complex data to this collection. must create schemas.
"""

