import { SxProps } from '@mui/material';

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { getCurrentVersion } from '~/contexts/version';

type Props = {
	isOpen: boolean,
	onClose: () => void,
}

const sx: SxProps = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
}

function NewVersionModal({ isOpen, onClose }: Props) {
	const versionTag = `v${getCurrentVersion()}`;
	const releaseLink = `https://github.com/wkym461a/cycle-combo/releases/tag/${versionTag}`;

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
		>
			<Box sx={sx}>
				<Typography
					component='div'
					variant="h5"
				>
				<a target='_blank' href={releaseLink}>{versionTag}</a> へようこそ！
				</Typography>

				<Typography
					component='div'
					sx={{ mt: 2 }}
				>
					詳細は開発者に確認してください。
				</Typography>

				<Stack
					direction='row'
					spacing={2}
					sx={{
						mt: 3,
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					<Button
						variant='text'
						color='primary'
						onClick={onClose}
						sx={{
							fontWeight: 700,
						}}
					>
						OK
					</Button>
				</Stack>
			</Box>
		</Modal>
	)
}

export default NewVersionModal;
