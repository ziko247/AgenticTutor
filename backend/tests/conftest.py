import pytest


def pytest_addoption(parser):
    parser.addoption(
        "--run-integration",
        action="store_true",
        default=False,
        help="Run tests against the dedicated local Supabase project only",
    )


def pytest_collection_modifyitems(config, items):
    if not config.getoption("--run-integration"):
        skip = pytest.mark.skip(reason="Use --run-integration with local Supabase")
        for item in items:
            if "integration" in item.keywords:
                item.add_marker(skip)
