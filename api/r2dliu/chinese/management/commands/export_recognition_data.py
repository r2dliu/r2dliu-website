"""Precompute the handwriting recognition data into a file shipped with the
API, so a fresh instance loads it in milliseconds instead of querying the
database. CI runs this before deploying."""

from django.core.management.base import BaseCommand

from r2dliu.chinese import drawing


class Command(BaseCommand):
    help = "Write r2dliu/chinese/recognition.npz from the strokes table"

    def handle(self, *args, **options):
        groups = drawing.build_groups()
        drawing.save_groups(groups)
        count = sum(len(names) for names, _, _ in groups.values())
        size = drawing.DATA_FILE.stat().st_size / 1e6
        self.stdout.write(
            self.style.SUCCESS(
                f"{count} characters -> {drawing.DATA_FILE} ({size:.1f} MB)"
            )
        )
