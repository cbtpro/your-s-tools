import React from "react";
import { Button, Result } from "@arco-design/web-react";
import { useNavigate } from "react-router-dom";
import "./notfound.css";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button
            type="primary"
            shape="round"
            onClick={() => navigate("/")}
          >
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
