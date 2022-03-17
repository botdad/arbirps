/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace ArbibotRPS {
  export type EndParamsStruct = {
    proof: BigNumberish[];
    arbibotId: BigNumberish;
    roundId: BigNumberish;
    move1: BigNumberish;
    move1Attestation: BigNumberish;
  };

  export type EndParamsStructOutput = [
    BigNumber[],
    BigNumber,
    BigNumber,
    number,
    BigNumber
  ] & {
    proof: BigNumber[];
    arbibotId: BigNumber;
    roundId: BigNumber;
    move1: number;
    move1Attestation: BigNumber;
  };

  export type RoundStruct = {
    arbibotId1: BigNumberish;
    arbibotId2: BigNumberish;
    move1Attestation: BigNumberish;
    wager: BigNumberish;
    nonce: BigNumberish;
    maxRoundTime: BigNumberish;
    startedAt: BigNumberish;
    move2PlayedAt: BigNumberish;
    move1: BigNumberish;
    move2: BigNumberish;
    winner: BigNumberish;
    ended: boolean;
  };

  export type RoundStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    number,
    number,
    boolean
  ] & {
    arbibotId1: BigNumber;
    arbibotId2: BigNumber;
    move1Attestation: BigNumber;
    wager: BigNumber;
    nonce: number;
    maxRoundTime: BigNumber;
    startedAt: BigNumber;
    move2PlayedAt: BigNumber;
    move1: number;
    move2: number;
    winner: number;
    ended: boolean;
  };

  export type StartParamsStruct = {
    proof: BigNumberish[];
    arbibotId: BigNumberish;
    moveAttestation: BigNumberish;
    nonce: BigNumberish;
    maxRoundTime: BigNumberish;
    permitAmount: BigNumberish;
    permitDeadline: BigNumberish;
    permitV: BigNumberish;
    permitR: BytesLike;
    permitS: BytesLike;
  };

  export type StartParamsStructOutput = [
    BigNumber[],
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    number,
    string,
    string
  ] & {
    proof: BigNumber[];
    arbibotId: BigNumber;
    moveAttestation: BigNumber;
    nonce: number;
    maxRoundTime: BigNumber;
    permitAmount: BigNumber;
    permitDeadline: BigNumber;
    permitV: number;
    permitR: string;
    permitS: string;
  };

  export type Move2ParamsStruct = {
    arbibotId: BigNumberish;
    roundId: BigNumberish;
    move: BigNumberish;
    permitDeadline: BigNumberish;
    permitV: BigNumberish;
    permitR: BytesLike;
    permitS: BytesLike;
  };

  export type Move2ParamsStructOutput = [
    BigNumber,
    BigNumber,
    number,
    BigNumber,
    number,
    string,
    string
  ] & {
    arbibotId: BigNumber;
    roundId: BigNumber;
    move: number;
    permitDeadline: BigNumber;
    permitV: number;
    permitR: string;
    permitS: string;
  };
}

export interface ArbibotRPSInterface extends utils.Interface {
  contractName: "ArbibotRPS";
  functions: {
    "DEAD_MOVE()": FunctionFragment;
    "arbibots()": FunctionFragment;
    "botgold()": FunctionFragment;
    "collectForfeit(uint256,uint256)": FunctionFragment;
    "endRound((uint256[8],uint256,uint256,uint8,uint256))": FunctionFragment;
    "getNonce(uint256)": FunctionFragment;
    "getRefund(uint256,uint256)": FunctionFragment;
    "getRound(uint256)": FunctionFragment;
    "getRounds()": FunctionFragment;
    "rounds(uint256)": FunctionFragment;
    "startRound((uint256[8],uint256,uint256,uint32,uint64,uint256,uint256,uint8,bytes32,bytes32))": FunctionFragment;
    "submitMove2((uint256,uint256,uint8,uint256,uint8,bytes32,bytes32))": FunctionFragment;
    "totalRounds()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "DEAD_MOVE", values?: undefined): string;
  encodeFunctionData(functionFragment: "arbibots", values?: undefined): string;
  encodeFunctionData(functionFragment: "botgold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "collectForfeit",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "endRound",
    values: [ArbibotRPS.EndParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getNonce",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRefund",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRound",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getRounds", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rounds",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "startRound",
    values: [ArbibotRPS.StartParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "submitMove2",
    values: [ArbibotRPS.Move2ParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "totalRounds",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "DEAD_MOVE", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "arbibots", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "botgold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "collectForfeit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "endRound", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getNonce", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRefund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRound", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getRounds", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rounds", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startRound", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "submitMove2",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalRounds",
    data: BytesLike
  ): Result;

  events: {};
}

export interface ArbibotRPS extends BaseContract {
  contractName: "ArbibotRPS";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ArbibotRPSInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DEAD_MOVE(overrides?: CallOverrides): Promise<[number]>;

    arbibots(overrides?: CallOverrides): Promise<[string]>;

    botgold(overrides?: CallOverrides): Promise<[string]>;

    collectForfeit(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    endRound(
      params: ArbibotRPS.EndParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getNonce(
      arbibotId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { nonce: BigNumber }>;

    getRefund(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRound(
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[ArbibotRPS.RoundStructOutput]>;

    getRounds(
      overrides?: CallOverrides
    ): Promise<[ArbibotRPS.RoundStructOutput[]]>;

    rounds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean
      ] & {
        arbibotId1: BigNumber;
        arbibotId2: BigNumber;
        move1Attestation: BigNumber;
        wager: BigNumber;
        nonce: number;
        maxRoundTime: BigNumber;
        startedAt: BigNumber;
        move2PlayedAt: BigNumber;
        move1: number;
        move2: number;
        winner: number;
        ended: boolean;
      }
    >;

    startRound(
      params: ArbibotRPS.StartParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    submitMove2(
      params: ArbibotRPS.Move2ParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    totalRounds(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  DEAD_MOVE(overrides?: CallOverrides): Promise<number>;

  arbibots(overrides?: CallOverrides): Promise<string>;

  botgold(overrides?: CallOverrides): Promise<string>;

  collectForfeit(
    arbibotId: BigNumberish,
    roundId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  endRound(
    params: ArbibotRPS.EndParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getNonce(
    arbibotId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getRefund(
    arbibotId: BigNumberish,
    roundId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRound(
    roundId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<ArbibotRPS.RoundStructOutput>;

  getRounds(overrides?: CallOverrides): Promise<ArbibotRPS.RoundStructOutput[]>;

  rounds(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      number,
      BigNumber,
      BigNumber,
      BigNumber,
      number,
      number,
      number,
      boolean
    ] & {
      arbibotId1: BigNumber;
      arbibotId2: BigNumber;
      move1Attestation: BigNumber;
      wager: BigNumber;
      nonce: number;
      maxRoundTime: BigNumber;
      startedAt: BigNumber;
      move2PlayedAt: BigNumber;
      move1: number;
      move2: number;
      winner: number;
      ended: boolean;
    }
  >;

  startRound(
    params: ArbibotRPS.StartParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  submitMove2(
    params: ArbibotRPS.Move2ParamsStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  totalRounds(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    DEAD_MOVE(overrides?: CallOverrides): Promise<number>;

    arbibots(overrides?: CallOverrides): Promise<string>;

    botgold(overrides?: CallOverrides): Promise<string>;

    collectForfeit(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    endRound(
      params: ArbibotRPS.EndParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getNonce(
      arbibotId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRefund(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getRound(
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<ArbibotRPS.RoundStructOutput>;

    getRounds(
      overrides?: CallOverrides
    ): Promise<ArbibotRPS.RoundStructOutput[]>;

    rounds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean
      ] & {
        arbibotId1: BigNumber;
        arbibotId2: BigNumber;
        move1Attestation: BigNumber;
        wager: BigNumber;
        nonce: number;
        maxRoundTime: BigNumber;
        startedAt: BigNumber;
        move2PlayedAt: BigNumber;
        move1: number;
        move2: number;
        winner: number;
        ended: boolean;
      }
    >;

    startRound(
      params: ArbibotRPS.StartParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    submitMove2(
      params: ArbibotRPS.Move2ParamsStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    totalRounds(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    DEAD_MOVE(overrides?: CallOverrides): Promise<BigNumber>;

    arbibots(overrides?: CallOverrides): Promise<BigNumber>;

    botgold(overrides?: CallOverrides): Promise<BigNumber>;

    collectForfeit(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    endRound(
      params: ArbibotRPS.EndParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getNonce(
      arbibotId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRefund(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRound(
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRounds(overrides?: CallOverrides): Promise<BigNumber>;

    rounds(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    startRound(
      params: ArbibotRPS.StartParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    submitMove2(
      params: ArbibotRPS.Move2ParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    totalRounds(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    DEAD_MOVE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    arbibots(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    botgold(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    collectForfeit(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    endRound(
      params: ArbibotRPS.EndParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getNonce(
      arbibotId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRefund(
      arbibotId: BigNumberish,
      roundId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRound(
      roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRounds(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rounds(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    startRound(
      params: ArbibotRPS.StartParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    submitMove2(
      params: ArbibotRPS.Move2ParamsStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    totalRounds(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
