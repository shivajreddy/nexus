
moving 'community', 'section_number', 'lot_number' from teclab.epc_data
into project_info : 'community', 'section', 'lot_number'
```python
@router.get('/sanitize-projects')
def sanitize():
    db = client["nexus"]
    projects_coll = db["projects"]

    # move all from epc_ to projectinfo
    projects_coll.aggregate([
        {
            '$set': {
                'project_info': {
                    'community': '$teclab_data.epc_data.community',
                    'section': '$teclab_data.epc_data.section_number',
                    'lot_number': '$teclab_data.epc_data.lot_number',
                },
            },
        },
        {'$merge': {'into': 'projects', 'whenMatched': 'merge'}},
    ])
    projects_coll.update_many(
        {},
        {
            '$unset': {
                'teclab_data.epc_data.community': '',
                'teclab_data.epc_data.section_number': '',
                'teclab_data.epc_data.lot_number': '',
            }
        }
    )
    return "DONE"
```
