import jinja2
import datetime


def yearsago(years, from_date=None):
    if from_date is None:
        from_date = datetime.datetime.now()
    try:
        return from_date.replace(year=from_date.year - years)
    except:
        # Must be 2/29!
        assert from_date.month == 2 and from_date.day == 29  # can be removed
        return from_date.replace(month=2, day=28, year=from_date.year - years)


def num_years(begin, end=None):
    if end is None:
        end = datetime.datetime.now()
    num_years = int((end - begin).days / 365.25)
    if begin > yearsago(num_years, end):
        return num_years - 1
    else:
        return num_years


class YearsFrom(jinja2.ext.Extension):
    tags = set(['years_from'])

    def __init__(self, environment):
        super(YearsFrom, self).__init__(environment)

    def parse(self, parser):
        lineno = parser.stream.next().lineno
        year = jinja2.nodes.Const(int(parser.parse_expression().value))
        parser.stream.skip_if('comma')
        month = jinja2.nodes.Const(int(parser.parse_expression().value))
        parser.stream.skip_if('comma')
        day = jinja2.nodes.Const(int(parser.parse_expression().value))
        return jinja2.nodes.Output([
            self.call_method('_render', [year, month, day]),
        ]).set_lineno(lineno)

    def _render(self, year, month, day):
        birthday_date = datetime.datetime(year, month, day)
        years_from = num_years(birthday_date)
        return str(years_from)


@jinja2.evalcontextfilter
def unordered_list(eval_ctx, value):
    """
    Recursively takes a self-nested list and returns an HTML unordered list --
    WITHOUT opening and closing <ul> tags.

    The list is assumed to be in the proper format. For example, if ``var``
    contains: ``['States', ['Kansas', ['Lawrence', 'Topeka'], 'Illinois']]``,
    then ``{{ var|unordered_list }}`` would return::

        <li>States
        <ul>
                <li>Kansas
                <ul>
                        <li>Lawrence</li>
                        <li>Topeka</li>
                </ul>
                </li>
                <li>Illinois</li>
        </ul>
        </li>
    """
    def _helper(list_, tabs=1):
        indent = '\t' * tabs
        output = []

        list_length = len(list_)
        i = 0
        while i < list_length:
            title = list_[i]
            sublist = ''
            sublist_item = None
            if isinstance(title, (list, tuple)):
                sublist_item = title
                title = ''
            elif i < list_length - 1:
                next_item = list_[i + 1]
                if next_item and isinstance(next_item, (list, tuple)):
                    # The next item is a sub-list.
                    sublist_item = next_item
                    # We've processed the next item now too.
                    i += 1
            if sublist_item:
                sublist = _helper(sublist_item, tabs + 1)
                sublist = '\n%s<ul>\n%s\n%s</ul>\n%s' % (indent, sublist,
                                                         indent, indent)
            output.append('%s<li>%s%s</li>' % (indent, title, sublist))
            i += 1
        return '\n'.join(output)
    result = _helper(value)
    if eval_ctx.autoescape:
        result = jinja2.Markup(result)
    return result
