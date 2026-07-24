# hoa-builder
A fun full-stack development exercise. Practical application of database design, coding principles, and lightweight technologies.

## Setup

> $ pip install fastapi
Server that we use to test fastapi on.
> $ pip install uvicorn

Note: I'm using python 3.14. These libraries were packaged under this version's global. Create a virtual environment if you need these containerized.

1. Create a simple response package for visiting the root directory. Note calls are asynchronous by default.

Run your server:
> $ python -m uvicorn main:app --reload

Visit the localhost site your webapp is running on (ex: http://127.0.0.1:8000). It should print out the json package.