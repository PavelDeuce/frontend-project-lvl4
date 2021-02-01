import React, { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Button, Container, Form } from 'react-bootstrap';

import { addMessageToChannel } from '../../service';
import useFocus from '../../utils/useFocus';
import UsernameContext from '../../utils/UsernameContext';

const MessageForm = () => {
  const username = useContext(UsernameContext);
  const { currentChannelId } = useSelector((state) => state.channels);
  const [inputRef, setInputFocus] = useFocus();

  useEffect(() => {
    setInputFocus();
  });

  const formik = useFormik({
    initialValues: { message: '' },
    onSubmit: async (values) => {
      const attributes = {
        body: values.message,
        username,
        date: new Date(),
      };

      await addMessageToChannel(currentChannelId, attributes);
      formik.resetForm();
    },
  });

  return (
    <Container className="mt-auto mb-1">
      <Form className="input-form-group" onSubmit={formik.handleSubmit}>
        <Form.Control
          value={formik.values.message}
          onChange={formik.handleChange}
          name="message"
          type="text"
          className="mr-2 form-control"
          ref={inputRef}
        />
        <Button type="submit" className="btn btn-primary">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default MessageForm;
