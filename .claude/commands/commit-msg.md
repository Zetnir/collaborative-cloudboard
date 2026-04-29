---
description: Generate a commit message and commit staged changes
allowed-tools: Bash(git *)
---

1. Run `git diff --staged` to see the staged changes
2. Write a concise conventional commit message based on the changes
3. Run `git commit -m "<your message>"` to commit directly

Follow conventional commits format: type(scope): description
Types: feat, fix, docs, style, refactor, test, chore
Keep the message under 72 characters.
