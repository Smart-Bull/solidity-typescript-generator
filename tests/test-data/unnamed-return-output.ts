// THIS FILE IS AUTOMATICALLY GENERATED BY `generateContractInterfaces.ts`. DO NOT EDIT BY HAND'

import { EventDescription, DecodedEvent, ParameterDescription, EncodableArray, EncodableTuple, decodeParameters, decodeEvent, decodeMethod } from '@zoltu/ethereum-abi-encoder'
export { EncodableArray, EncodableTuple }

export interface Log {
	readonly topics: ReadonlyArray<bigint>
	readonly data: Uint8Array
}
export interface TransactionReceipt {
	readonly status: boolean
	readonly logs: Iterable<Log>
}

export const eventDescriptions: { [signatureHash: string]: EventDescription & {signature: string} } = {

}



export type Event = DecodedEvent


export interface Dependencies {
	call(address: bigint, methodSignature: string, methodParameters: EncodableArray, value: bigint): Promise<Uint8Array>
	submitTransaction(address: bigint, methodSignature: string, methodParameters: EncodableArray, value: bigint): Promise<TransactionReceipt>
}


/**
 * By convention, pure/view methods have a `_` suffix on them indicating to the caller that the function will be executed locally and return the function's result.  payable/nonpayable functions have both a local version and a remote version (distinguished by the trailing `_`).  If the remote method is called, you will only get back a transaction hash which can be used to lookup the transaction receipt for success/failure (due to EVM limitations you will not get the function results back).
 */
export class Contract {
	protected constructor(protected readonly dependencies: Dependencies, public readonly address: bigint) { }

	protected async localCall(methodSignature: string, outputParameterDescriptions: ReadonlyArray<ParameterDescription>, methodParameters: EncodableArray, attachedEth?: bigint): Promise<EncodableTuple> {
		const result = await this.dependencies.call(this.address, methodSignature, methodParameters, attachedEth || 0n)
		if (result.length >= 4 && result[0] === 8 && result[1] === 195 && result[2] === 121 && result[3] === 160) {
			const decodedError = decodeMethod(0x08c379a0, [ { name: 'message', type: 'string' } ], result) as { message: string }
			throw new Error(`Contract Error: ${decodedError.message}`)
		}
		return decodeParameters(outputParameterDescriptions, result)
	}

	protected async remoteCall(methodSignature: string, parameters: EncodableArray, errorContext: { transactionName: string }, attachedEth?: bigint): Promise<Array<Event>> {
		const transactionReceipt = await this.dependencies.submitTransaction(this.address, methodSignature, parameters, attachedEth || 0n)
		if (!transactionReceipt.status) throw new Error(`Remote call of ${errorContext.transactionName} failed: ${JSON.stringify(transactionReceipt)}`)
		return this.decodeEvents(transactionReceipt.logs)
	}

	private decodeEvents(encodedEvents: Iterable<Log>): Array<Event> {
		const decodedEvents: Array<DecodedEvent> = []
		for (const encodedEvent of encodedEvents) {
			const decodedEvent = this.tryDecodeEvent(encodedEvent)
			if (decodedEvent) decodedEvents.push(decodedEvent)
		}
		return decodedEvents as Array<Event>
	}

	private tryDecodeEvent(encodedEvent: Log): DecodedEvent | null {
		const signatureHash = encodedEvent.topics[0]
		const eventDescription = eventDescriptions[signatureHash.toString(16)]
		if (!eventDescription) return null
		return decodeEvent(eventDescription, encodedEvent.topics, encodedEvent.data)
	}
}


export class banana extends Contract {
	public constructor(dependencies: Dependencies, address: bigint) {
		super(dependencies, address)
	}

	public cherry_ = async (): Promise<boolean> => {
		const methodSignature = 'cherry()' as const
		const methodParameters = [] as const
		const outputParameterDescriptions = [{"name":"","type":"bool"}] as const
		const result = await this.localCall(methodSignature, outputParameterDescriptions, methodParameters)
		return <boolean>result.result
	}
}
