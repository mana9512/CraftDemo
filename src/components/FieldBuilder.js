import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  List,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import { Layout, Space } from "antd";
import { FieldService } from "./MockService";
import { headerStyle, contentStyle } from "./constants";

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Text } = Typography;

const FieldBuilder = () => {
  const [formData, setFormData] = useState({
    label: "",
    defaultChoice: "",
    type: "multi-select",
    order: "alphabetical",
    choices: [],
    required: false,
    newChoice: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    try {
      const savedFormData = JSON.parse(localStorage.getItem("formData"));
      if (savedFormData) {
        setFormData(savedFormData);
      }
    } catch (error) {
      console.error("Error parsing saved form data: ", error);
    }
  }, []);

  const handleClearForm = () => {
    setFormData({
      label: "",
      defaultChoice: "",
      type: "multi-select",
      order: "alphabetical",
      choices: [],
      required: false,
      newChoice: "",
    });
    localStorage.removeItem("formData");
  };

  const clearErrors = () => {
    const errors = { ...formErrors };
    delete errors.choices;
    setFormErrors(errors);
  }

  const handleLabelChange = (value) => {
    if(formData.label) {
      const errors = formErrors
      delete errors.label
      setFormErrors(errors)
    }
    setFormData({...formData, label: value})
  }

  const handleAddChoice = () => {
    clearErrors()
    if (!formData.newChoice) return;
    if (formData.choices.length > 1) {
      setFormErrors({
        ...formErrors,
        choices: "Maximum number of choices allowed is 50",
      });
    } else {
      // remove duplicates and merge with already added choices
      const mergedChoices = [
        ...new Set([...formData.choices, formData.newChoice.trim()]),
      ];
      setFormData({ ...formData, choices: mergedChoices, newChoice: "" });
    }
  };

  const handleRemoveChoice = (choice) => {
    clearErrors()
    const filteredChoices = [...formData.choices.filter((c) => c !== choice)];
    setFormData({ ...formData, choices: filteredChoices });
  };

  const handleFormSubmit = () => {
    setFormErrors({});
    if (!formData.label) {
      setFormErrors({ ...formErrors, label: "Label is required" });
      return;
    }
    if (
      formData.defaultChoice &&
      !formData.choices.includes(formData.defaultChoice)
    ) {
      const choices = [...formData.choices, formData.defaultChoice];
      setFormData({ ...formData, choices: choices });
    }
    localStorage.removeItem("formData");
    FieldService.saveField(formData);
  };

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("formData", JSON.stringify(formData));
  });
  
  const formItemLayout = {
    labelCol: { xs: 24, sm: 4 }, 
    wrapperCol:{ xs: 24, sm: 20, md: 8 }
  };
 
  return (
    <Fragment>
      <div className="container" style={{ padding: "20px" }}>
        <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
          <Layout>
            <Header style={headerStyle}>Field Builder</Header>
            <Content style={contentStyle}>
              <Form {...formItemLayout} onFinish={handleFormSubmit} onReset={handleClearForm}>
                <Form.Item

                  label="Label"
                  name="label"
                >
                  <Input
                    value={formData.label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                  />
                  {formErrors.label && (
                    <Text type="danger">{formErrors.label}</Text>
                  )}
                </Form.Item>
                <Form.Item
                  label="Type"
                  name="required"
                >
                  <Row justify="space-between">
                    <Col>
                      {" "}
                      <Text>Multi-Select</Text>
                    </Col>
                    <Col>
                      <Checkbox
                        checked={formData.required}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            required: e.target.checked,
                          })
                        }
                      >
                        A Value is Required
                      </Checkbox>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item
                  label="Default"
                  name="defaultChoice"
                >
                  <Input
                    value={formData.defaultChoice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defaultChoice: e.target.value,
                      })
                    }
                  />
                  {formErrors.label && <Text type="danger"></Text>}
                </Form.Item>
                <Form.Item
                  label="Choices"
                  name="chocies"
                >
                  <Row justify="space-between">
                    <Col span={12}>
                      <TextArea
                        placeholder="Enter new choices"
                        value={formData.newChoice}
                        onChange={(e) => setFormData({ ...formData, newChoice: e.target.value })}
                        style={{
                          color:
                            formData.newChoice.length > 40 ? "red" : "black",
                        }}
                      />
                    </Col>
                    <Col>
                      <Button type="primary" onClick={handleAddChoice}>
                        Add Choices
                      </Button>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "20px" }} justify="space-between">
                    <Col span={12}>
                      <List
                        bordered
                        dataSource={formData.choices}
                        renderItem={(choice) => (
                          <List.Item>
                            {choice}
                            <Button
                              type="link"
                              onClick={() => handleRemoveChoice(choice)}
                              danger
                            >
                              Remove
                            </Button>
                          </List.Item>
                        )}
                      />
                    </Col>
                    {formErrors.choices && (
                      <Text type="danger">{formErrors.choices}</Text>
                    )}
                  </Row>
                </Form.Item>
                <Form.Item
                  label="Order"
                  name="order"
                >
                  <Select
                    value={formData.order}
                    onChange={(e, value) =>
                      setFormData({ ...formData, order: value.value })
                    }
                    defaultValue={{
                      value: "alphabetical",
                      label: "Display choices in alphabetical",
                    }}
                    options={[
                      {
                        value: "alphabetical",
                        label: "Display choices in alphabetical",
                      },
                    ]}
                  />
                </Form.Item>
                <Row>
                  <Col offset={4}>
                    <Space>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Save Changes
                        </Button>
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="reset">
                          Cancel
                        </Button>
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Content>
          </Layout>
        </Space>
      </div>
    </Fragment>
  );
};

export default FieldBuilder;