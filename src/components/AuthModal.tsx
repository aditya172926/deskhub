import { invoke } from "@tauri-apps/api/tauri";
import { Avatar, Button, Col, Modal, Row, Typography } from "antd";
import { useState } from "react";
import { GithubAuthCode, Nullable } from "../types";

interface Props {
  shouldShowModal: boolean;
  onSubmit: (token: string) => void;
  onCancel: () => void;
}

const AuthModal = ({ shouldShowModal, onSubmit, onCancel }: Props) => {
  const { Title, Text } = Typography;
  const [authCode, setAuthCode] = useState<Nullable<GithubAuthCode>>(null);

  const pollAuthApi = async (device_code: string) => {
    const response: any = await invoke("call_api_method", {
      method: "POST",
      url: "https://github.com/login/oauth/access_token",
      query: {
        client_id: "",
        device_code: device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    });
    console.log("Polling response ", JSON.parse(response));
  };

  const newWindow = async () => {
    try {
      const response: any = await invoke("call_api_method", {
        method: "POST",
        url: "https://github.com/login/device/code",
        query: { client_id: "" },
      });

      const json_response = JSON.parse(response);
      setAuthCode(json_response);
      await invoke("generate_new_window", {
        url: "https://github.com/login/device",
        label: "Authentication",
        title: "GitHub Auth",
      });
      const pollResponse = setInterval(function () {
        pollAuthApi(json_response.device_code);
      }, 6000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Modal centered footer={null} open={shouldShowModal} onCancel={onCancel}>
      <Row justify="center">
        <Col>
          <Title level={4}>Authenticate using Github</Title>
        </Col>
      </Row>
      <Row justify="center" style={{ margin: "5%" }}>
        <Col>
          <Avatar shape="square" size={50} src="../../app-icon.png" /> -------{" "}
          <Avatar shape="square" size={50} src="../../github-mark.png" />
        </Col>
      </Row>
      {authCode?.user_code ? (
        <>
          <Row justify="center">
            <Col>
              <Title level={4}>{authCode?.user_code}</Title>
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              <Text>Paste the above code in the new window</Text>
            </Col>
          </Row>
        </>
      ) : (
        <Row justify="center" style={{ margin: "5%" }}>
          <Col span={24}>
            <Button onClick={() => newWindow()} block={true}>
              Sign In with GitHub
            </Button>
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default AuthModal;
