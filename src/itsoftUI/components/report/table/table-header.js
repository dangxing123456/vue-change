
export default {
    name: 'ITRTableHeader',
    render() {
        return (
            <table>
                <thead>
                <tr>
                    {
                        this.columns.map((column) => (
                            <th>
                                {column.label}
                            </th>
                        ))
                    }
                </tr>
                </thead>
            </table>
        );
    },
    props: {
        columns: {
            type: Array,
            default: function () {
                return [];
            }
        }
    },
    data() {
        return {};
    }
}
