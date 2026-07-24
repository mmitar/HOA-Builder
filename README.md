# hoa-builder
A fun full-stack development exercise. Practical application of database design, coding principles, and lightweight technologies.

## Setup

> $ pip install fastapi
Server that we use to test fastapi on.
> $ pip install uvicorn

Note: I'm using python 3.14. These libraries were packaged under this version's global. Create a virtual environment if you need these containerized.

1. Create a simple response package for visiting the root directory. Note calls are asynchronous by default. `Commit ID 175e3b1`

Run your server:
> $ python -m uvicorn main:app --reload

Visit the localhost site your webapp is running on (ex: http://127.0.0.1:8000). The home Root route should print out the Hello World payload.

> curl -X GET -H "Content-Type: application/json" 'http://127.0.0.1:8000'

2. Let's mock up a post service to start the CRUD implementation. Under main create a POST function that accepts a string that adds to an array. Either via postman or curl, POST to the communities route.

> curl -X POST -H "Content-Type: application/json" 'http://127.0.0.1:8000/communities?community=Highlands'
