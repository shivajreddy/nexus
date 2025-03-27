# Nexus

### Central system for Eagle Construction of Va.

# TODO

- [ ] Edit the colors of loading spinner
- [ ] LoginForm component - refactor it, separate the business logic.
- [ ] Better error displaying on LoginForm -(show toast) - server not
      responding, other errors.

- [ ] New lot page - when width is reduced the # of cards should be 1 in a row

## Roles

```txt
1xx - Public
    - 101 - Public pages
2xx - TECLab Department
    20x - EPC Public Related
    21x - EPC related
        - 210 - EPC viewer
        - 211 - EPC-lot-editor
        - 213 - epc super user -> get emails, change form data
    22x - Field OPS related
        - 220 - FOSC viewer
        - 221 - FOSC editor
        - 223 - FOSC super user -> get emails, change form data
    29x - Team Lead & Department head
        - 291 - Drafting Head
        - 292 - Home Siting & FOSC Head
        - 299 - Department(TECLAB) Head
9** - ADMIN KEY 
    999 - ADMIN -> access to everything

```
