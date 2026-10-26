'use client';

import { Trash2 } from 'lucide-react';
import type { Control } from 'react-hook-form';

import {
  CheckboxField,
  Form,
  SubmitButton,
  TextField,
  useZodForm
} from '@/components/forms';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  type AddAddressValues,
  addAddressDefaultValues,
  addAddressSchema,
  addressToFormValues,
  editAddressSchema
} from '@/lib/validations/address';
import {
  addAddress,
  deleteAddress,
  updateAddress
} from '@/store/address/actions';
import { useAppDispatch } from '@/store/hooks';
import type { Address } from '@/types';

type AddressControl = Control<AddAddressValues, unknown, AddAddressValues>;

function AddressFields({ control }: { control: AddressControl }) {
  return (
    <>
      <TextField
        control={control}
        name='address'
        label='Address'
        placeholder='Address: Street, House No / Apartment No'
        autoComplete='street-address'
      />
      <TextField
        control={control}
        name='city'
        label='City'
        placeholder='City'
        autoComplete='address-level2'
      />
      <div className='grid gap-5 sm:grid-cols-2'>
        <TextField
          control={control}
          name='state'
          label='State'
          placeholder='State'
          autoComplete='address-level1'
        />
        <TextField
          control={control}
          name='country'
          label='Country'
          placeholder='Please Enter Your Country'
          autoComplete='country-name'
        />
      </div>
      <TextField
        control={control}
        name='zipCode'
        label='Zipcode'
        placeholder='Please Enter Your Zipcode'
        autoComplete='postal-code'
        className='sm:max-w-[calc(50%-0.625rem)]'
      />
      <CheckboxField
        control={control}
        name='isDefault'
        label='As the Default'
      />
    </>
  );
}

export function AddAddressForm() {
  const dispatch = useAppDispatch();
  const form = useZodForm(addAddressSchema, {
    defaultValues: addAddressDefaultValues
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        await dispatch(addAddress(values));
      }}
      className='max-w-2xl space-y-5'
    >
      <AddressFields control={form.control} />
      <div className='border-t pt-5'>
        <SubmitButton loading={form.formState.isSubmitting}>
          Add Address
        </SubmitButton>
      </div>
    </Form>
  );
}

export function EditAddressForm({ address }: { address: Address }) {
  const dispatch = useAppDispatch();
  const form = useZodForm(editAddressSchema, {
    defaultValues: addressToFormValues(address)
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        await dispatch(updateAddress(address._id, values));
      }}
      className='max-w-2xl space-y-5'
    >
      <AddressFields control={form.control} />
      <div className='flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center'>
        <SubmitButton loading={form.formState.isSubmitting}>Save</SubmitButton>
        <ConfirmDialog
          trigger={
            <Button type='button' variant='destructive'>
              <Trash2 /> Delete
            </Button>
          }
          title='Delete this address?'
          description='This address will be removed from your account.'
          confirmLabel='Delete address'
          onConfirm={() => dispatch(deleteAddress(address._id))}
        />
      </div>
    </Form>
  );
}
