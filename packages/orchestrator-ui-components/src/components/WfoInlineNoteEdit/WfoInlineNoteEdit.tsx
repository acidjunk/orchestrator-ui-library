import React, { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FC } from 'react';

import { EuiInlineEditText } from '@elastic/eui';

import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import type { Subscription } from '@/types';

interface WfoInlineNoteEditProps {
    value: Subscription['note'];
    subscriptionId?: Subscription['subscriptionId'];
}

export const WfoInlineNoteEdit: FC<WfoInlineNoteEditProps> = ({
    value,
    subscriptionId,
}) => {
    const [startProcess] = useStartProcessMutation();
    const triggerNoteModifyWorkflow = () => {
        const noteModifyPayload = [
            { subscription_id: subscriptionId },
            { note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });
    };

    const initialNote = useMemo(() => value || '', [value]);
    const [note, setNote] = useState<string>(initialNote);

    // This useEffect makes sure the note is updated when a new value property is passed in
    // for example by a parent component that is update through a websocket event
    useEffect(() => {
        setNote(initialNote);
    }, [initialNote]);

    return (
        <EuiInlineEditText
            inputAriaLabel="Edit note"
            value={note}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setNote(e.target.value);
            }}
            onCancel={() => setNote(initialNote)}
            onSave={() => triggerNoteModifyWorkflow()}
            size={'s'}
            css={{
                width: '100%',
                '.euiFlexItem': { justifyContent: 'center' },
            }}
            editModeProps={{
                formRowProps: {
                    fullWidth: true,
                    display: 'center',
                },
                saveButtonProps: {
                    color: 'primary',
                    size: 'xs',
                },
                cancelButtonProps: {
                    color: 'danger',
                    size: 'xs',
                },
            }}
        />
    );
};
