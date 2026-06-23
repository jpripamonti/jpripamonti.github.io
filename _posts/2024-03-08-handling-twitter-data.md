---
layout: post
title:  "Handling Twitter Data with Pandas: CSV Settings That Preserve Text"
date:   2024-03-08
excerpt: "Tweet text often contains commas, quotes, line breaks, emojis, and URLs. CSV can still work, but it needs explicit quoting and matching read settings."
---

Working with Twitter data is messy, and not just because of API access. Tweet text can contain commas, quotes, line breaks, emojis, tabs, URLs, and copied text from other sources. CSV can preserve that content, but only if the write and read settings are explicit and symmetric.

For most cases, `pandas.to_csv` is enough. The important part is to configure quoting, escaping, encoding, and line endings deliberately:

```python
import csv
import pandas as pd

df.to_csv(
    "twitter_data.csv",
    index=False,
    encoding="utf-8",
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
    lineterminator="\n",
)
```

Read the file back with matching options:

```python
df = pd.read_csv(
    "twitter_data.csv",
    encoding="utf-8",
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
)
```

This avoids treating commas or embedded line breaks inside tweet text as structural CSV delimiters. It also makes the output more predictable across operating systems and tools.

If you control both the writer and the reader, consider using Parquet instead:

```python
df.to_parquet("twitter_data.parquet", index=False)
df = pd.read_parquet("twitter_data.parquet")
```

Parquet preserves schema and avoids many CSV edge cases. CSV is still useful for interoperability, but for text-heavy pipelines it should be treated as an exchange format, not the safest internal storage format.
