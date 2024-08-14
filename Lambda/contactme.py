import json
import boto3
import uuid
from datetime import datetime

# Initialize the DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('contact-me')

# Initialize the SES client
ses = boto3.client('ses', region_name='us-east-1')  # Specify your SES region

def lambda_handler(event, context):
    try:
        # Check if 'body' exists in the event, if not log and return an error
        if 'body' in event:
            # Parse the incoming JSON body
            data = json.loads(event['body'])
        else:
            # If 'body' is not found, handle the request assuming data is directly in the event
            data = event
        
        # Extract fields from the incoming data
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        message = data.get('message')
        
        if not name or not phone or not email or not message:
            raise ValueError("Missing required fields in the request")
        
        # Generate a unique ID for the item
        item_id = str(uuid.uuid4())
        
        # Optional: Add a timestamp to the item
        timestamp = datetime.utcnow().isoformat()
        
        # Prepare the item to be inserted into DynamoDB
        item = {
            'id': item_id,  # Primary key
            'name': name,
            'phone': phone,
            'email': email,
            'message': message,
            'timestamp': timestamp  # Optional timestamp
        }
        
        # Insert the item into DynamoDB
        table.put_item(Item=item)
        
        # Send an email using SES
        response = ses.send_email(
            Source='daljyotgrewal@gmail.com',
            Destination={
                'ToAddresses': [
                    'daljyotgrewal@gmail.com'
                ]
            },
            Message={
                'Subject': {
                    'Data': 'New Contact Form Submission'
                },
                'Body': {
                    'Text': {
                        'Data': f"New contact form submission:\n\nName: {name}\nPhone: {phone}\nEmail: {email}\nMessage: {message}"
                    }
                }
            }
        )
        
        # Return a successful response with CORS headers
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # Allow all origins or specify your domain
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': {
                'message': 'Data stored successfully and email sent',
                'id': item_id,
                'ses_response': response
            }
        }
    
    except ValueError as ve:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': {
                'message': 'Invalid request',
                'error': str(ve)
            }
        }
    
    except Exception as e:
        # Handle any other errors that may occur
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': {
                'message': 'An error occurred',
                'error': str(e)
            }
        }
