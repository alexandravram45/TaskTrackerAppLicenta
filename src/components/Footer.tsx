import { Typography } from "@mui/material";
import styled from "styled-components";
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

export const Box = styled.div`
	padding: 20px;
	background: #9599ff3b;
	bottom: 0;
`;

export const FooterContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const Column = styled.div`
	display: flex;
	flex-direction: column;
	text-align: left;
    max-width: 400px;
`;

export const Row = styled.div`
	display: flex;
    justify-content: center;
    gap: 50px;
	
	
`;

export const FooterLink = styled.a`
	color: #fff;
	margin-bottom: 20px;
	font-size: 18px;
	text-decoration: none;

	&:hover {
		color: rgb(91, 66, 243);
		transition: 200ms ease-in;
	}
`;

export const Heading = styled.p`
	font-size: 24px;
	margin-bottom: 40px;
	font-weight: bold;
`;


const Footer = () => {
	return (
		<Box > 
			<h1
				style={{
					color: "rgb(91, 66, 243)",
					textAlign: "center",
					marginTop: "10px",
				}}
			>
				Stay connected with Ticked
			</h1>
			<FooterContainer>
				<Row>
					<Column>
						<Heading>About Us</Heading>
						<Typography variant="subtitle1">At Ticked, we strive to bring innovation and efficiency to project management. With a dedicated team and a bold vision, we aim to transform the way people work together and provide them with the tools they need to achieve their goals.</Typography>
					</Column>
					
					<Column>
						<Heading>Contact Us</Heading>
						<FooterLink >
                            ticked@gmail.com
						</FooterLink>
						<FooterLink >
							+40 763 465 307
						</FooterLink>
						<FooterLink >
							Timisoara, Romania
						</FooterLink>
						
					</Column>
					<Column style={{ textAlign: 'center'}}>
						<Heading>Social Media</Heading>
						<FooterLink >
							<FacebookOutlinedIcon style={{fontSize: "40px"}}/>
						</FooterLink>
						<FooterLink>
                            <InstagramIcon style={{fontSize: "40px"}}/>
						</FooterLink>
						<FooterLink>
                            <TwitterIcon style={{fontSize: "40px"}}/>
						</FooterLink>
						
					</Column>
				</Row>
			</FooterContainer>
		</Box>
	);
};
export default Footer;
