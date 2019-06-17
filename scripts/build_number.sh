#!/bin/bash

git rev-list --count $(git tag --list | grep -Pm 1 $(git tag --list | grep -Po v\\d+.\\d+.\\d+ | tail -n 1))..HEAD