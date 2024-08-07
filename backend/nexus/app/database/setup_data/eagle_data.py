# Proprietary Eagle data

"""
collection: users
schema's:
description:
"""
from datetime import datetime

# users_coll_initial_data = [
#     {
#         "username": "1test@eagleofva.com",
#         "security":
#             {
#                 "roles": [101],
#                 "hashed_password": "$2b$12$yOKxjIO6wdi9J4S1z/g0Oumk/lALx541oYDw6gfIFfsgfDIHIzLQq",
#                 "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjF0ZXN0QGVhZ2xlb2Z2YS5jb20iLCJjcmVhdGVkX2F0IjoiMjAyMy0xMC0yNFQxODozMToxNy40NjAyMzMrMDA6MDAiLCJleHAiOjE2OTgyNTg2Nzd9.ZAeOgC3rPTpyGig6mFKpH1AWjlLcDtfcd98D11HNmeY",
#                 "verified": True,
#                 "created_at": "2023-10-03T18:50:39.757334",
#             },
#         "name": "",
#         "email": "",
#         "title": "",
#         "department": "TEC Lab",
#         "teams": ""
#     }
#
# ]

"""
collection: eagle-data
schema's:
description:
"""
eagle_data_coll_initial_data = [
    {
        "table_name": "departments",
        "departments_names": [
            "TEC Lab",
            "Sales",
            "Warranty",
            "Design"
        ],
        "departments_data":
            [
                {"department_name": "TEC Lab",
                 "department_head": "Nathan Blinn",
                 "all_teams":
                     [
                         {"team_name": "Drafting",
                          "team_description": "",
                          "team_head": "",
                          "team_members": []
                          },
                         {"team_name": "Software",
                          "team_description": "",
                          "team_head": "",
                          "team_members": []
                          },
                         {"team_name": "Permitting",
                          "team_description": "",
                          "team_head": "",
                          "team_members": []
                          },
                         {"team_name": "Field OPS",
                          "team_description": "",
                          "team_head": "",
                          "team_members": []
                          },
                         {"team_name": "Field OPS",
                          "team_description": "",
                          "team_head": "",
                          "team_members": []
                          }
                     ]
                 }
            ],
    },
    {
        "table_name": "communities",
        "all_communities_names":
            [
                'Cypress Creek',
                "Ford's Colony",
                'Foushee',
                'Ginter Park',
                'Givens Farm',
                'GreenGate',
                'Harpers Mill',
                'Lankford Crossing',
                'Lauradell',
                'McRae & Lacy',
                'Parkside Village',
                'Readers Branch',
                'Row at Westhampton',
                'The Meadows',
                'The Parke @ Cypress Creek',
                "Settler's Ridge",
                'Stags Trail',
                'GreenGate Condos',
                'Midtown',
                'BHC Armstrong',
                'WBV EE',
                'The Blufftons',
                'The Preserve',
                'GreenGate Villas',
                'Parke @ Westport',
                'Maggie Walker Trust',
                'Womack',
                'The Preserve TH'
            ]
    },
    {
        "table_name": "engineers",
        "all_engineers_names": [
            'DFI',
            'HBS',
            'Riverside',
            'Struc Tech',
            'NONE',
            'BFS',
            'UFP',
            'Kempsville'
        ]
    },
    {
        "table_name": "counties",
        "all_counties_names": [
            'Blacksburg',
            'Chesterfield',
            'Christiansburg',
            'Goochland',
            'Hanover',
            'Isle of Wight',
            'Richmond',
            'Henrico',
            'NONE',
            'Montgomery',
            'James City'
        ]
    },
    {
        "table_name": "plat_engineers",
        "all_plat_engineers_names": [
            'Cardinal',
            'Gay and Neel',
            'Hassel',
            'Koontz',
            'Parker Design',
            'NONE',
            'EDA',
            'AES',
            'Townes',
            'Balzer',
            'Bay Design'
        ]
    },
]

"""
collection: department-data
schema's:
description:
"""
department_data_coll_initial_data = [
    {
        "department_name": "TEC Lab",
        "data":
            {
                "teams": [
                    {
                        "team_name": "Drafting",
                        "team_head": "K.Fadl",
                        "team_members": ["C.Zobel", "R.Arias", "K.Fadl", "S.Reddy", "B.James", "Y.Wang"]
                    },
                    {
                        "team_name": "Software Development",
                        "team_head": "S.Reddy",
                        "team_members": ["S.Reddy"]
                    }
                ],

                "core_models": {
                    "all_core_models_names": [
                        'Linden 3'
                    ]
                },

                "products": {
                    "all_products_names": [
                        "Acton",
                        "Belmont",
                        "Belmont Terrace",
                        "Beverly",
                        "Bradford",
                        "Carlisle",
                        "Caroline",
                        "Corvallis",
                        "Easton",
                        "Fulton",
                        "Fulton Terrace",
                        "Grayson",
                        "Hadley",
                        "Hartford II",
                        "Hartford Terrace",
                        "Hawthorne",
                        "Helena",
                        "Laurel",
                        "Linden III",
                        "Linden Terrace",
                        "Malvern",
                        "Manchester",
                        "Manchester Duplex",
                        "Newport",
                        "Park",
                        "Raleigh",
                        "Rowland",
                        "Savannah",
                        "Stamford",
                        "Wellington II",
                        "Westfield",
                        "Westminster",
                        "Cedar",
                        "Azalea",
                        "Magnolia",
                        "Cason",
                        "Longleaf",
                        "Linden IV",
                        "Bellavue",
                        "Clarion",
                        "NONE",
                        "Westmoreland",
                        "Boulevard",
                        "Arlington",
                        "McKinney",
                        "BHC 18G",
                        "BHC 18H",
                        "BHC 22C",
                        "BHC 22E",
                        "BHC 22F",
                        "Braddock",
                        "CUSTOM",
                        "Old Oyster Retreat",
                        "The Palmetto",
                        "Davidson",
                        "Diane's Farmhouse",
                        "BHC 22B",
                        "BHC 22D",
                        "BHC 22G",
                        "Brookline",
                        "Millcreek",
                        "Highland",
                    ]
                },

                "elevations": {
                    "all_elevations_names": [
                        '10 - Traditional',
                        '15 - Arts & Crafts',
                        '20 - Arts & Crafts',
                        '20 - Colonial',
                        '20 - Craftsman',
                        '25 - Folk Victorian',
                        '30 - Arts & Crafts',
                        '30 - Craftsman',
                        '35 - Cottage',
                        '40 - Arts & Crafts B',
                        '40 - European',
                        '40 - Folk Victorian',
                        '40 - New England',
                        '60 - Farmhouse',
                        'A - Colonial',
                        'A - European',
                        'A - Folk Victorian',
                        'Arts & Crafts',
                        'Arts & Crafts B',
                        'B - Craftsman',
                        'B - Folk Victorian',
                        'BSE - Arts & Crafts',
                        'Coastal',
                        'Colonial',
                        'Cottage',
                        'Craftsman',
                        'Folk Victorian',
                        'GE - A - 2 - R',
                        'GR - C - 1 - F',
                        'GR - D - 2 - R'
                    ]
                }

            }
    },

    {
        "department_name": "Sales",
        "data": {}
    }
]

"""
collection: projects-data
schema's:
description: documents that represent the 'house'(project) datastructure.
Any thing that has to do with a house, then that data should be inside this.
"""
projects_coll_initial_data = [
    {
        # Project-Info
        "project_uid": "TESTING",
        # "project_id": "XXX-XXX-XXX",
        "created_at": datetime.now(),
        # "created_by" : "",

        # company-wide data
        "contract_type": None,
        "contract_date": None,

        # department specific data
        # TEC LAB
        "teclab": {
            "epc_data": {
                "lot_status_finished": None,
                "lot_status_released": None,
                "community": None,
                "section_number": None,
                "lot_number": None,
                "contract_date": None,
                "contract_type": None,
                "product_name": None,
                "elevation_name": None,
                "drafting_drafter": None,
                "drafting_assigned_on": None,
                "drafting_finished_on": None,
                "engineering_engineer": None,
                "engineering_sent": None,
                "engineering_received": None,
                "plat_engineer": None,
                "plat_sent": None,
                "plat_received": None,
                "permitting_county_name": None,
                "permitting_submitted": None,
                "permitting_received": None,
                "bbp_posted": None,
                "notes": None
            },
        },

        # department specific data
        # SALES
        "sales": {
            "sales_agent": "J.Goldschmidt",
            "selections_finished_on": ""
        },
    }
]
