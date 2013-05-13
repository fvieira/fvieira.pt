from jinja2 import nodes
from jinja2.ext import Extension
import datetime


def yearsago(years, from_date=None):
    if from_date is None:
        from_date = datetime.datetime.now()
    try:
        return from_date.replace(year=from_date.year - years)
    except:
        # Must be 2/29!
        assert from_date.month == 2 and from_date.day == 29  # can be removed
        return from_date.replace(month=2, day=28, year=from_date.year-years)


def num_years(begin, end=None):
    if end is None:
        end = datetime.datetime.now()
    num_years = int((end - begin).days / 365.25)
    if begin > yearsago(num_years, end):
        return num_years - 1
    else:
        return num_years


class YearsFrom(Extension):
    tags = set(['years_from'])

    def __init__(self, environment):
        super(YearsFrom, self).__init__(environment)

    def parse(self, parser):
        lineno = parser.stream.next().lineno
        year = nodes.Const(int(parser.parse_expression().value))
        parser.stream.skip_if('comma')
        month = nodes.Const(int(parser.parse_expression().value))
        parser.stream.skip_if('comma')
        day = nodes.Const(int(parser.parse_expression().value))
        return nodes.Output([
            self.call_method('_render', [year, month, day]),
        ]).set_lineno(lineno)

    def _render(self, year, month, day):
        birthday_date = datetime.datetime(year, month, day)
        years_from = num_years(birthday_date)
        return str(years_from)
