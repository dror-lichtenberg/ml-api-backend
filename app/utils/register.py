MODEL_REGISTRY = {}

def register_model(app, model_name, route_module, prefix="/api", endpoint=None):
    try:
        model_router = route_module.router
        actual_endpoint = endpoint or model_name
        app.include_router(model_router, prefix=prefix)
        MODEL_REGISTRY[model_name] = {
            "id": model_name,
            "name": route_module.MODEL_METADATA["name"],
            "description": route_module.MODEL_METADATA["description"],
            "endpoint": f"{prefix}/{actual_endpoint}",
            "input_schema": route_module.MODEL_METADATA["input_schema"],
            "output_schema": route_module.MODEL_METADATA["output_schema"],
            "example_input": route_module.MODEL_METADATA["example_input"],
            "valid_values": route_module.MODEL_METADATA.get("valid_values"),
        }
    except Exception as e:
        raise

def get_all_model_metadata():
    result = {}
    for name, meta in MODEL_REGISTRY.items():
        try:
            result[name] = {
                "id": name,
                "name": meta["name"],
                "description": meta["description"],
                "endpoint": meta["endpoint"],
                "input_schema": meta["input_schema"],
                "output_schema": meta["output_schema"],
                "example_input": meta["example_input"],
                "valid_values": meta.get("valid_values"),
            }
        except Exception as e:
            print(f"❌ Failed to serialize metadata for model '{name}': {e}")
    return result
