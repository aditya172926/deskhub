import { useEffect, useState } from "react";
import { GithubItem, Nullable } from "../types";
import { Avatar, Box, Card, CardBody, CardHeader, Flex, Heading, Text } from "@chakra-ui/react";

interface Props<T> {
  item: T;
  onSelect: (item: T) => void;
  selectedItem: Nullable<T>;
  title: string;
}

const ListItem = <T extends GithubItem>({
  item,
  onSelect,
  selectedItem,
  title,
}: Props<T>) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [gridStyle, setGridStyle] = useState<any>({
    margin: "3%",
    width: "94%",
  });

  useEffect(() => {
    const isSelected = selectedItem?.id === item.id;
    setGridStyle({
      margin: "3%",
      width: "94%",
      ...(isSelected && { backgroundColor: "lightblue" }),
    });
  }, [selectedItem]);

  const onClickHandler = () => {
    onSelect(item);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    // <p>{title}</p>
    <Card>
      <CardHeader>
        <Flex gap={4}>
          <Avatar src={item.owner.avatar_url} />
          <Box>
            <Heading size='sm'>{title}</Heading>
            <Text>{item.description}</Text>
          </Box>
        </Flex>

      </CardHeader>
    </Card>
    // <Card.Grid hoverable={true} style={gridStyle} onClick={onClickHandler}>
    //   <Skeleton loading={loading} avatar active>
    //     <Card.Meta
    //       avatar={<Avatar src={item.owner.avatar_url} />}
    //       title={title}
    //       description={`By ${item.owner.login}`}
    //     />
    //   </Skeleton>
    // </Card.Grid>
  );
};

export default ListItem;