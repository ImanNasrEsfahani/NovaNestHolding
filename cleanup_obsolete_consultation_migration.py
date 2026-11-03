"""Delete the one superseded migration after replacing the initial migration.

Run in the project root on your DEVELOPMENT COMPUTER, never on the server.
Dry-run by default; add --apply to remove the old migration file.
Does not connect to or change any database.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

EXPECTED_GIT_BLOB = '4f796a09f0be72c11f19bde797996eb8028036be'
RELATIVE_FILE = Path('backend/submission_audit/migrations/0003_consultation_idempotency.py')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Delete the obsolete migration file')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    current_initial = root / 'backend/submission_audit/migrations/0001_initial.py'
    if not current_initial.is_file():
        parser.error('Missing initial audit migration; run from the checked-out project root.')
    if "name='ConsultationIdempotencyRecord'" not in current_initial.read_text(encoding='utf-8'):
        parser.error('The replacement 0001_initial.py does not yet contain the idempotency model.')
    target = root / RELATIVE_FILE
    if not target.exists():
        print(f'Already absent: {RELATIVE_FILE}')
        return
    raw = target.read_bytes()
    current_hash = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    if current_hash != EXPECTED_GIT_BLOB:
        parser.error(f'Refusing to delete modified migration: {RELATIVE_FILE} ({current_hash})')
    if args.apply:
        target.unlink()
        print(f'Deleted obsolete migration: {RELATIVE_FILE}')
    else:
        print(f'Would delete: {RELATIVE_FILE} (run with --apply to confirm)')


if __name__ == '__main__':
    main()
