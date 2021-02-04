import React, { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';

import { addMessageToChannel } from '../../service';
import UseFocus from '../../utils/UseFocus';
import UsernameContext from '../../utils/UsernameContext';

const MessageForm = () => {
  const username = useContext(UsernameContext);
  const { currentChannelId } = useSelector((state) => state.channels);
  const [inputRef, setInputFocus] = UseFocus();

  useEffect(() => {
    setInputFocus();
  });

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: Yup.object({
      message: Yup.string().trim().required('required'),
    }),
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

  const isDisabledButton = formik.isSubmitting || !formik.isValid;

  return (
    <div className="mt-auto mb-1">
      <Form className="input-form-group" onSubmit={formik.handleSubmit}>
        <Form.Control
          value={formik.values.message}
          onChange={formik.handleChange}
          name="message"
          type="text"
          className="mr-2 form-control"
          ref={inputRef}
        />
        <Button type="submit" className="btn btn-primary" disabled={isDisabledButton}>
          {formik.isSubmitting ? (
            <Spinner animation="border" role="status" variant="light" size="sm" />
          ) : (
            'Submit'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default MessageForm;
