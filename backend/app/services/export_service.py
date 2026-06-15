import pandas as pd

def export_csv(df, output_path):
    df.to_csv(output_path, index=False)

def export_excel(df, output_path):
    df.to_excel(output_path, index=False)