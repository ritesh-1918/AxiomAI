import os
import pandas as pd
from datasets import load_dataset

def main():
    # Configuration
    dataset_name = "DevQuasar/llm-router-dataset-synth"
    output_dir = os.path.join("backend", "data")
    output_file = os.path.join(output_dir, "llm_router_dataset.csv")

    print(f"Downloading dataset: {dataset_name}...")
    try:
        # Load the dataset (using 'train' split by default)
        ds = load_dataset(dataset_name, split="train")
        
        # Convert to pandas DataFrame
        df = pd.DataFrame(ds)
        
        # Display available columns for debugging
        print(f"Original columns: {df.columns.tolist()}")

        # Rename columns to match requirements (text, label)
        # We try to infer likely column names if exact matches aren't found
        column_mapping = {}
        
        # Map to 'text'
        if 'text' in df.columns:
            pass # already good
        elif 'prompt' in df.columns:
            column_mapping['prompt'] = 'text'
        elif 'instruction' in df.columns:
            column_mapping['instruction'] = 'text'

        # Map to 'label'
        if 'label' in df.columns:
            pass # already good
        elif 'tier' in df.columns:
            column_mapping['tier'] = 'label'
        elif 'model' in df.columns:
            column_mapping['model'] = 'label'
        elif 'category' in df.columns:
            column_mapping['category'] = 'label'

        if column_mapping:
            print(f"Renaming columns: {column_mapping}")
            df = df.rename(columns=column_mapping)

        # Verify we have the required columns
        required_columns = ['text', 'label']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise ValueError(f"Missing required columns after mapping: {missing_columns}. Available: {df.columns.tolist()}")

        # Select only the required columns
        df = df[required_columns]

        # Ensure output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Save to CSV
        print(f"Saving to {output_file}...")
        df.to_csv(output_file, index=False)
        print("Done!")

    except Exception as e:
        print(f"Error processing dataset: {e}")
        exit(1)

if __name__ == "__main__":
    main()
