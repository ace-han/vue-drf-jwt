import os

from django.conf import settings

_VERSION_FILE = os.path.join(settings.BASE_DIR, '.version.info')

VERSION_HASH = ""

if os.path.isfile(_VERSION_FILE):
    with open(_VERSION_FILE) as file:
        VERSION_HASH = file.read()

_GIT_LIB_EXISTS = True
try:
    import git
except ImportError:
    _GIT_LIB_EXISTS = False

if _GIT_LIB_EXISTS:
    try:
        repo = git.Repo()
        if repo is not None:
            VERSION_HASH = repo.head.object.hexsha
    except git.InvalidGitRepositoryError:
        pass


def build_info(request):
    return {
        'git_hash': VERSION_HASH
    }
