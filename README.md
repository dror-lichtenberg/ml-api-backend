# ML API Backend (FastAPI + Vercel)

A modular ML backend exposing multiple models as serverless APIs using FastAPI and Vercel.

## Endpoints

- `POST /api/predict_model_a`
- `POST /api/predict_model_b`

## Local Development

```bash
uvicorn api.predict_model_a:app --reload
```

## Deployment

- Connect repo to [Vercel](https://vercel.com/)
- All functions in `api/` auto-deploy as serverless endpoints
