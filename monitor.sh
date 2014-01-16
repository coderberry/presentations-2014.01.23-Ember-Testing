#!/bin/bash
fsmonitor -p '+slide_config.js' '+scripts/md/slides.md' '+scripts/md/base.html' python scripts/md/render.py
