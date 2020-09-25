FROM python:3.7
RUN mkdir /server
WORKDIR /server
COPY requirements.txt /server
COPY server.py /server/
RUN pip install --upgrade pip --no-cache-dir
RUN pip install -r requirements.txt --no-cache-dir
EXPOSE 80
ENTRYPOINT [ "python" ]
CMD [ "server.py" ]