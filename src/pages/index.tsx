import React, { useContext, useState } from 'react';
import { Button, Form, FormInstance, Input, InputNumber, Popconfirm, Table, TimePicker, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
import 'dayjs/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/en_US';
import moment from 'moment';



interface Item {
  key: string;
  name: string;
  age: string[];
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 5; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: ['12:00', '14:00'],
    address: `London Park no. ${i}`,
  });
}
const { RangePicker } = TimePicker
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
  handleSave: (record: Item) => void;
}
const EditableContext = React.createContext<FormInstance<any> | null>(null);

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  handleSave,
  ...restProps
}) => {
  const form = useContext(EditableContext)!;

  const save = async () => {
    try {
      console.log('save')
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  const onChangeTimer = (e: RangeValue<dayjs.Dayjs>) => {
    console.log("时间选择", e)
  };
  const inputNode = inputType === 'text' ? <Input onBlur={save} onPressEnter={save} /> :
    <RangePicker onBlur={save} onChange={(e) => onChangeTimer(e)} ></RangePicker>

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [disable, setDisable] = useState(true);

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    // console.log('edit', { ...record })
    setEditingKey('');
    let data={ ...record }
    let time1:any='';
    let time2:any='';
    if(data.age){
      time1=dayjs(data?.age[0],'HH:mm')
      time2=dayjs(data?.age[1],'HH.mm')
    }
    record.age=[time1,time2]
    console.log('edit', { ...record })

    form.setFieldsValue({  ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  /*   const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as Item;
  
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setData(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setData(newData);
          setEditingKey('');
        }
        console.log('newData3333',newData)
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    }; */

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
      // render: (_:any, record:Item) => (
      //   <div>
      //     <Input
      //       onClick={() => edit(record)}
      //       // onBlur={() => save(record.key)}
      //       // onChange={() => save(record.key)}
      //       placeholder={"请输入"}
      //       value={record?.name}
      //       disabled={disable}
      //     />
      //   </div>
      // ),
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '35%',
      editable: true,
      render: (_: any, record: Item) => (
        <div>
          <RangePicker
            // locale={locale}
            // onClick={() => edit(record)}
            // onBlur={() => save(record.key)}
            // onChange={() => save(record.key)}
            // placeholder={"请输入"}
            value={
              record.age
                ? [
                  dayjs(record.age[0], 'HH:mm'),
                  dayjs(record.age[1], 'HH:mm'),
                ]
                : null
            }
            disabled={disable}
          />
        </div>
      ),
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '20%',
      editable: true,
      render: (_: any, record: Item) => (
        <div>
          <Input
            onClick={() => edit(record)}
            // onBlur={() => save(record.key)}
            // onChange={() => save(record.key)}
            placeholder={"请输入"}
            value={record?.address}
            disabled={disable}
          />
        </div>
      ),

    },
    /* {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    }, */
  ];
  const handleSave = (row: Item) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log('newData', newData)
    setData(newData);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'time' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        handleSave,
      }),
    };
  });
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      // handleSave();
      console.log('getData:', data);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  // api/v1/data/entities/shift_plan/query
  const editFunc = (data: any) => {
    // form.setFieldValue
    setDisable(false)
    for (let i of data) {
      console.log('编辑', i)
      // form.setFieldsValue(i);
      // setEditingKey(i.key);
    }

  }
  return (
    <Form form={form} component={false} onFinish={onFinish} >
      <Form.Item>
        <Button onClick={() => setDisable(false)}>编辑</Button >
        <Button >取消</Button >
        <Button type="primary" htmlType="submit" onClick={onCheck}>保存</Button >
      </Form.Item>
      <EditableContext.Provider value={form} >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </EditableContext.Provider>
    </Form>
  );
};

export default App;