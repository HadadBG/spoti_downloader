FROM hadadbg/python_java
USER root
RUN ln -s /bin/python3 /usr/bin/python

RUN apt install ffmpeg -y

SHELL ["/bin/bash", "-c"]
USER user
WORKDIR /app

EXPOSE 8080
COPY --chown=user:user . .

ENV VIRTUAL_ENV=/app/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install -r requirements.txt


CMD ["./mvnw", "clean","compile", "exec:java"]
