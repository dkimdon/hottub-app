STACK_NAME=bwa-console

update:
	aws cloudformation update-stack \
		--region us-west-2 \
		--capabilities CAPABILITY_IAM \
		--stack-name $(STACK_NAME) \
		--template-body file://stack.yaml
	aws cloudformation wait stack-update-complete \
		--region us-west-2 \
		--stack-name $(STACK_NAME)

create:
	aws cloudformation create-stack \
		--region us-west-2 \
		--capabilities CAPABILITY_IAM \
		--stack-name $(STACK_NAME) \
		--template-body file://stack.yaml
	aws cloudformation wait stack-create-complete \
		--region us-west-2 \
		--stack-name $(STACK_NAME)

