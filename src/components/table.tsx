import React, { Key } from "react";
import { ColumnType, FilterConfirmProps } from "antd/lib/table/interface";
import { Button, Input, Space, Table, TableProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { DataIndex } from "rc-table/lib/interface";
import { UseQuery } from "@/components/hooks";

interface Column<RecordType> extends ColumnType<RecordType> {
  searchable?: boolean;
}

export interface ColumnGroup<RecordType> extends Omit<Column<RecordType>, "dataIndex"> {
  children: Column<RecordType>;
}

export type ModularColumns<RecordType = unknown> = (ColumnGroup<RecordType> | Column<RecordType>)[];

interface Props<RecordType> extends TableProps<RecordType> {
  columns?: ModularColumns<RecordType>;
  query?: {
    columns?: (data: RecordType[]) => ModularColumns<RecordType>;
    endpoint: string;
    total?: number;
    key: string;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export class ModularTable<RecordType extends object> extends React.Component<Props<RecordType>> {
  state = {
    searchText: "",
    searchedColumn: "",
    page: 1,
  };

  getColumnSearchProps = (column: Column<RecordType>): Column<RecordType> => {
    let searchInput: Input | null;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              searchInput = node;
            }}
            placeholder={`Search ${column.dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm, column.dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, column.dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) setTimeout(() => searchInput?.select(), 100);
      },
      render: (text) =>
        this.state.searchedColumn === column.dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

  handleSearch = (
    selectedKeys: Key[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex?: DataIndex,
  ) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters?: () => void) => {
    clearFilters?.();
    this.setState({ searchText: "" });
  };

  getColumns = (columns: ModularColumns<RecordType>) =>
    columns.map((v) => {
      if (v.searchable !== true) return v;
      return { ...v, ...this.getColumnSearchProps(v) };
    }) ?? [];

  render() {
    if (this.props.query) {
      return (
        <UseQuery
          options={{
            queryFn: async () => {
              const response = await fetch(
                `/api${this.props.query?.endpoint ?? ""}?perPage=${10}&page=${this.state.page}`,
              );

              if (response.ok) return await response.json();
              else throw new Error("Failed to fetch");
            },
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            queryKey: [this.props.query?.endpoint ?? "", this.state.page, 10],
          }}
        >
          {(result) => {
            const { elements, total }: { elements: RecordType[]; total: number } = (result?.data ??
              {}) as never;

            const data = result.error
              ? []
              : ((elements ?? []) as RecordType[]).map((data) => ({
                  ...data,
                  key: data[(this.props.query?.key ?? "id") as never],
                }));

            const columns =
              this.props.query?.columns?.(result.isFetching ? [] : data) ??
              this.props.columns ??
              [];

            return (
              <Table
                {...this.props}
                scroll={{ x: "max-content" }}
                columns={this.getColumns(columns)}
                dataSource={data}
                pagination={{
                  onChange: (page) => this.setState({ page }),
                  total: total ?? this.props.query?.total ?? 0,
                }}
              />
            );
          }}
        </UseQuery>
      );
    }

    return (
      <Table
        {...this.props}
        scroll={{ x: "max-content" }}
        columns={this.getColumns(this.props.columns ?? [])}
      />
    );
  }
}
