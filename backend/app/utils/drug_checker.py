import json
from typing import List, Tuple, Dict
import os

# Load the JSON file here
file_path = os.path.join(os.path.dirname(__file__), 'drug_interaction.json')
with open(file_path, "r", encoding="utf-8") as f:
    interactions = json.load(f)

def _check_pair(prev: str, new: str) -> Tuple[bool, str]:
    """Check a single drug–drug pair."""
    prev_norm = prev.strip().lower()
    new_norm  = new.strip().lower()

    for entry in interactions:
        prec = entry['precipitant_drug']
        obj  = entry['object_drug']

        # normalize to lists
        prec_list = [prec] if isinstance(prec, str) else prec
        obj_list  = [obj]  if isinstance(obj, str)  else obj

        # build lowercase sets
        prec_set = {d.strip().lower() for d in prec_list}
        obj_set  = {d.strip().lower() for d in obj_list}

        # check both directions
        if (prev_norm in prec_set and new_norm in obj_set) or \
           (new_norm in prec_set and prev_norm in obj_set):
            return True, entry.get('interaction', '')
    return False, "No known interaction."

def check_interactions(
    prev_drugs: List[str], 
    new_drugs: List[str]
) -> List[Dict[str, str]]:
    """
    Compare every combination of prev_drugs x new_drugs.

    Returns a list of dicts:
      {
        "prev":   <prev drug name>,
        "new":    <new drug name>,
        "conflict": "True" or "False",
        "remarks": <the remarks or "No known interaction.">
      }
    """
    results = []
    for prev in prev_drugs:
        for new in new_drugs:
            conflict, remarks = _check_pair(prev, new) # here remarks means interaction
            results.append({
                "prev": prev,
                "new": new,
                "conflict": str(conflict),
                "remarks": remarks
            })
    return results

# Example usage:
""" prev_list = ["Sildenafil", "Adrenaline"]
new_list  = ["Nitrates", "Oral contraceptives"]
out = check_interactions(prev_list, new_list)
for r in out:
    print(f"{r['prev']} and {r['new']} → conflict={r['conflict']}, remarks={r['remarks']}") """
