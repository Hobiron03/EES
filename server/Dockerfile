FROM python:3.7
RUN mkdir /server
WORKDIR /server
COPY requirements.txt /server
COPY server.py /server
COPY EmotionExpression-5c731e905750.json /server
RUN pip install --upgrade pip --no-cache-dir
RUN pip install -r requirements.txt --no-cache-dir
EXPOSE 5000
ENTRYPOINT [ "python" ]
CMD [ "server.py" ]