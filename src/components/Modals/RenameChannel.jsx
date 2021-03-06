import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';

import { useFormik } from 'formik';
import { updateChannel } from '../../service';
import UseFocus from '../../hooks/UseFocus';
import { getChannelsNames } from '../../store';

const RenameChannel = ({ onHide, data }) => {
  const { t } = useTranslation();
  const channelsNames = useSelector(getChannelsNames);
  const [inputRef, setInputFocus] = UseFocus();

  useEffect(() => {
    setInputFocus();
  }, [setInputFocus]);

  const formik = useFormik({
    initialValues: {
      newChannelName: data.name,
    },
    validationSchema: Yup.object({
      newChannelName: Yup.string().trim().required('required').notOneOf(channelsNames, 'exist'),
    }),
    onSubmit: async (values, actions) => {
      const { newChannelName: newName } = values;

      try {
        await updateChannel(data.id, newName);
        onHide();
      } catch (error) {
        actions.setFieldError('request', error);
      }
    },
  });

  const isDisabledButton = formik.isSubmitting || formik.errors.newChannelName;

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Modal.Header>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
        <Button type="button" className="close" onClick={onHide}>
          ×
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder={t('modals.form.placeholder')}
          name="newChannelName"
          className="formControl"
          value={formik.values.newChannelName}
          onChange={formik.handleChange}
          ref={inputRef}
          isInvalid={formik.errors.newChannelName || formik.errors.request}
        />
        {formik.errors.newChannelName === 'required' && (
          <Form.Control.Feedback type="invalid">{t('modals.form.required')}</Form.Control.Feedback>
        )}
        {formik.errors.newChannelName === 'exist' && (
          <Form.Control.Feedback type="invalid">{t('modals.form.uniq')}</Form.Control.Feedback>
        )}
        {formik.errors.request && (
          <Form.Control.Feedback type="invalid">{t('errors.connection')}</Form.Control.Feedback>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onHide}>
          {t('modals.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={isDisabledButton}>
          {formik.isSubmitting ? (
            <Spinner animation="border" role="status" variant="light" size="sm" />
          ) : (
            t('modals.submit')
          )}
        </Button>
      </Modal.Footer>
    </Form>
  );
};

export default RenameChannel;
