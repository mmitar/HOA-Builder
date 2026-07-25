# hoa-builder
A fun full-stack development exercise. Practical application of database design, coding principles, and lightweight technologies.

## Setup

Install the following packages to spin up the server. Note: I'm using python 3.14. These libraries were packaged under this version's global. Create a virtual environment if you need these containerized.

> $ pip install fastapi
> $ pip install uvicorn
> $ pip install sqlalchemy
> $ pip install sqlmodel

Run your server using below command in terminal. Visit the localhost spun-up (ex: http://127.0.0.1:8000).
> $ python -m uvicorn main:app --reload

While the server is running, review API documentation at http://127.0.0.1:8000/docs or http://127.0.0.1:8000/redoc.

## Approach

My methodology throughout the project to maintain CI/CD is as follows:
- DRY principles, encapsulation, and separation of concerns. This exercise will exemplify M-V-C principles.
- Explicit type casting API services so the interpreter can validate business rules.
- Making minor changes and testing affected functionality after every code change.
- Features are loosely coupled and relatively independent. A change to one service does not impact another. However underlying utility functions that share a resource always have test cases to ensure stability to all callers.

1. Started with FastAPI on the backend. I wanted to confirm I could standup the foundation of the project that hands-off data. From here I could build persistence and content layers indepedently.

2. I would first prototype CRUD operations through FastAPI using a basic "Community" model; using a model establishes I have services working with a higher degree of complexity but also inherits rules defined in the model. CRUD operations would have basic validation and return managed HTTPExceptions if the request did not align with either the model rules or business rules.

- Checking for posting duplicate Name Fields.
- IDs are managed by the server, not the client.
- Returned the appropriate HTTP status code based on which business rule went unsatisfied. Example: 404 for any CRUD operations attempting to request data that does not exist, etc..

3. With core CRUD API services functional, I created a persistence layer using SQLite, implemented by SQLModel. I chose SQLModel because its very minimal overhead compared to SQLAlchemy, doing much of the declarations and binding under the hood. With persistence enabled, I began structuring the project, creating designated spaces for routers and database references. I identified a practical way to minimize database dependency declaration so the project is scalable and maintainable as it scales up its router complexity.

4. Implemented CORS middleware with a defind whitelist. Job can now run using `python main.py`.