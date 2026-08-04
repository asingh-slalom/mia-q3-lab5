# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development so useful discoveries are reused instead of rediscovered.

It supports iterative workflows such as TDD, lint remediation, and debugging by separating stable guidance from active in-progress notes.

## Two Types of Memory

### Persistent Memory

Persistent memory is the stable project guidance kept in [.github/copilot-instructions.md](../copilot-instructions.md).

Use persistent memory for:
- Foundational principles
- Long-lived workflow rules
- Team-level standards that should apply to all sessions

### Working Memory

Working memory is kept in this directory, [.github/memory/](.).

Use working memory for:
- Session discoveries
- Repeatable implementation patterns
- Decisions made while solving real issues

## Directory Structure

- [.github/memory/session-notes.md](session-notes.md): historical summaries of completed sessions
- [.github/memory/patterns-discovered.md](patterns-discovered.md): accumulated implementation and troubleshooting patterns
- [.github/memory/scratch/working-notes.md](scratch/working-notes.md): active notes for the current session

## How To Use During Common Workflows

### TDD Workflow

1. Before starting, review [.github/memory/patterns-discovered.md](patterns-discovered.md) for relevant test or implementation patterns.
2. Capture active thinking, hypotheses, and Red-Green-Refactor progress in [.github/memory/scratch/working-notes.md](scratch/working-notes.md).
3. When the session is complete, summarize outcomes and decisions in [.github/memory/session-notes.md](session-notes.md).
4. If a pattern is reusable, add it to [.github/memory/patterns-discovered.md](patterns-discovered.md).

### Linting and Code Quality Workflow

1. Track lint categories and fix strategy in [.github/memory/scratch/working-notes.md](scratch/working-notes.md).
2. Record recurring lint remediation techniques in [.github/memory/patterns-discovered.md](patterns-discovered.md).
3. Capture what changed and why in [.github/memory/session-notes.md](session-notes.md).

### Debugging Workflow

1. Log symptoms, failing tests, and hypotheses in [.github/memory/scratch/working-notes.md](scratch/working-notes.md).
2. Record root causes and durable fix patterns in [.github/memory/patterns-discovered.md](patterns-discovered.md).
3. Write a concise completed-session summary in [.github/memory/session-notes.md](session-notes.md).

## AI Context Application

AI assistants can use this structure to provide context-aware help:
- Read stable rules from [.github/copilot-instructions.md](../copilot-instructions.md)
- Read historical outcomes from [.github/memory/session-notes.md](session-notes.md)
- Reuse proven approaches from [.github/memory/patterns-discovered.md](patterns-discovered.md)
- During active implementation, use [.github/memory/scratch/working-notes.md](scratch/working-notes.md) as the live session context

This allows future suggestions to align with prior decisions and known project patterns.

## Completed vs Active Notes

- [.github/memory/session-notes.md](session-notes.md): completed session summaries that are committed to git as historical record.
- [.github/memory/scratch/working-notes.md](scratch/working-notes.md): active, in-progress notes for current work that are not committed.

At the end of each session, promote key findings from scratch notes into committed memory files.
