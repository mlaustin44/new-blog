---
title: Fleet deployment platform
number: 2
date: 2026-06-30
summary: Staged rollouts, health gates and on-robot rollback for machines working in the field.
tags: [robotics, deployment, infrastructure]
period: "[YEARS]"
role: "[ROLE]"
company: "[COMPANY]"
draft: true
---

> **Sample entry.** A stand-in case study from the design mockups. Replace the bracketed facts and this text, or delete the folder.

## The problem

Software had to reach robots on customer sites without anyone driving out to them, and without a bad build ever reaching the whole fleet at once.

## What I built

A rollout service that orders stages by blast radius, a health gate between each stage, and an updater on the robot that can always fall back to the last known-good image.

## Outcome

[What changed: fleet size supported, release cadence, rollbacks avoided.]
