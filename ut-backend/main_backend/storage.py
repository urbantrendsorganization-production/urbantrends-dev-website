from whitenoise.storage import CompressedManifestStaticFilesStorage, MissingFileError


class ManifestStaticFilesStorage(CompressedManifestStaticFilesStorage):
    def post_process(self, paths, dry_run=False, **options):
        for name, hashed_name, processed in super().post_process(paths, dry_run, **options):
            if isinstance(processed, MissingFileError):
                processed = False
            yield name, hashed_name, processed
