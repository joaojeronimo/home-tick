#!/usr/bin/env bash

set -eo pipefail

export $(cat .env | xargs)

if [ -z "$SSH_COMMAND" ]; then
  SSH_COMMAND="ssh"
fi

# after treating optional environment variables we won't allow unbound ones anymore
set -u

excludes=$(git -C . ls-files --exclude-standard -oi --directory >.git/ignores.tmp && echo .git/ignores.tmp)

rsync \
  -azP -e "${SSH_COMMAND}" \
  --exclude=.git \
  --exclude-from="$excludes" \
  --include='.env' \
  --progress \
  . $REMOTE_SSH_ADDR:~/app2

ssh $REMOTE_SSH_ADDR 'bash --login -c "\
		cd app && \
		docker-compose -f docker-compose.production.yml up --build -d"'