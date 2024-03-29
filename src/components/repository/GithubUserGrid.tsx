import { Link } from "react-router-dom";
import { GithubUser } from "../../types";
import { Avatar, Card, List } from "antd";

interface Props {
  users: GithubUser[];
}

const GithubUserGrid = ({ users }: Props) => (
  <List
    grid={{ gutter: 16, column: 4 }}
    dataSource={users}
    renderItem={(user, index) => (
      <List.Item key={index} style={{ marginTop: "5px" }}>
        <Card.Meta
          avatar={<Link to={"/profile"} state={user}><Avatar src={user.avatar_url} /></Link>} 
          title={user.login}
        />
      </List.Item>
    )}
  />
);

export default GithubUserGrid;