import pandas as pd
from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.responses import FileResponse, Response, HTMLResponse
from fastapi.templating import Jinja2Templates
from classify import classify
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory=".")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("/templates/index.html", {"request": request})

async def process_file(file: UploadFile):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")
    
    try:
        df = pd.read_csv(file.file)
        if "source" not in df.columns or "log_message" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'source' and 'log_message' columns.")
        return df
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV file: {e}")
    finally:
        file.file.close()

@app.post("/classify-csv/")
async def classify_logs_as_csv(file: UploadFile):
    df = await process_file(file)
    df["target_label"] = classify(list(zip(df["source"], df["log_message"])))
    output_file = "output.csv"
    df.to_csv(output_file, index=False)
    return FileResponse(
        output_file, 
        media_type='text/csv', 
        filename='classified_logs.csv'
    )

@app.post("/classify-text/")
async def classify_logs_as_text(file: UploadFile):
    df = await process_file(file)
    df["target_label"] = classify(list(zip(df["source"], df["log_message"])))
    output_text = df.to_string(index=False)
    return Response(content=output_text, media_type="text/plain")
