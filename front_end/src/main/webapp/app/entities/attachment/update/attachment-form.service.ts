import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAttachment, NewAttachment } from '../attachment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttachment for edit and NewAttachmentFormGroupInput for create.
 */
type AttachmentFormGroupInput = IAttachment | PartialWithRequiredKeyOf<NewAttachment>;

type AttachmentFormDefaults = Pick<NewAttachment, 'id'>;

type AttachmentFormGroupContent = {
  id: FormControl<IAttachment['id'] | NewAttachment['id']>;
  description: FormControl<IAttachment['description']>;
  fileName: FormControl<IAttachment['fileName']>;
  pathToFile: FormControl<IAttachment['pathToFile']>;
  type: FormControl<IAttachment['type']>;
  extension: FormControl<IAttachment['extension']>;
  ownerType: FormControl<IAttachment['ownerType']>;
  ownerId: FormControl<IAttachment['ownerId']>;
  status: FormControl<IAttachment['status']>;
};

export type AttachmentFormGroup = FormGroup<AttachmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttachmentFormService {
  createAttachmentFormGroup(attachment: AttachmentFormGroupInput = { id: null }): AttachmentFormGroup {
    const attachmentRawValue = {
      ...this.getFormDefaults(),
      ...attachment,
    };
    return new FormGroup<AttachmentFormGroupContent>({
      id: new FormControl(
        { value: attachmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(attachmentRawValue.description),
      fileName: new FormControl(attachmentRawValue.fileName),
      pathToFile: new FormControl(attachmentRawValue.pathToFile),
      type: new FormControl(attachmentRawValue.type),
      extension: new FormControl(attachmentRawValue.extension),
      ownerType: new FormControl(attachmentRawValue.ownerType),
      ownerId: new FormControl(attachmentRawValue.ownerId),
      status: new FormControl(attachmentRawValue.status),
    });
  }

  getAttachment(form: AttachmentFormGroup): IAttachment | NewAttachment {
    return form.getRawValue() as IAttachment | NewAttachment;
  }

  resetForm(form: AttachmentFormGroup, attachment: AttachmentFormGroupInput): void {
    const attachmentRawValue = { ...this.getFormDefaults(), ...attachment };
    form.reset(
      {
        ...attachmentRawValue,
        id: { value: attachmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AttachmentFormDefaults {
    return {
      id: null,
    };
  }
}
