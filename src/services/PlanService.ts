import { Length } from 'class-validator';
import { PlanOrderRepository } from './../repositories/PlanOrderRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PlanRepository } from '../repositories/PlanRepository';

@Service()
export class DailyPlanService {
  constructor(
    @InjectRepository() private planRepository: PlanRepository,
    @InjectRepository() private planOrderRepository: PlanOrderRepository,
  ) {}

  public async getPlans(userId: number, type: string, planDate: string) {
    try {
      const totalPlan = await this.planOrderRepository.find({
        where: {
          user_id: userId,
          type,
          planDate,
        },
      });

      if (totalPlan.length == 0) {
        return null;
      }

      const totalPlanList = totalPlan.pop()?.planList as number[];

      switch (type) {
        case 'daily': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
        case 'reschedule': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
        case 'routine': {
          const plans = await this.planRepository.findByIds(totalPlanList);
          return plans;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public async moveAndChangePlanOrder(
    userId: number,
    to: string,
    from: string,
    planId: number,
    lastArray: number[],
    planDate: string,
  ) {
    try {
      //* 같은 섹션 내 순서 변경
      if (to == from) {
        let changePlanList;
        const findPlanList = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: to,
            planDate,
          },
        });

        changePlanList = findPlanList.pop()?.planList as number[];
        changePlanList = lastArray;

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: changePlanList,
          },
        );
      }

      //* 일간 계획, 루틴로드 이동
      if (
        (to == 'daily' && from == 'routine') ||
        (to == 'routine' && from == 'daily')
      ) {
        //* 값을 복사하기 위한 planId 정보 찾기
        const findPlanInfo = await this.planRepository.findOne({
          where: {
            id: planId,
          },
        });
        if (!findPlanInfo) {
          return null;
        }

        //* 계획 블록 복사
        const newPlan = await this.planRepository.create({
          planName: findPlanInfo.planName,
          colorchip: findPlanInfo.colorchip,
          user: {
            id: userId,
          },
          planDate: findPlanInfo.planDate,
        });
        const duplicatePlan = await this.planRepository.save(newPlan);

        //* 최종 배열 수정
        const findPlanIdIndex = lastArray.indexOf(planId);
        lastArray.splice(findPlanIdIndex, 1, 34);

        //* planList에 최종 배열 업데이트
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: lastArray,
          },
        );
      }

      //* 일간계획, 우회할 계획 이동
      if (
        (to == 'daily' && from == 'reschedule') ||
        (to == 'reschedule' && from == 'daily')
      ) {
        if (to == 'reschedule' && from == 'daily')
          //* 우회할 계획으로 이동하는 계획블록 시간 데이터 삭제
          await this.planRepository.update(
            {
              id: planId,
            },
            {
              planTime: [],
              fulfillTime: [],
            },
          );

        let deletePlanList;
        //* 순서 이동 전 planList에서 planId 삭제 후 업데이트
        const findPlanList = await this.planOrderRepository.find({
          where: {
            user_id: userId,
            type: from,
            planDate,
          },
        });
        deletePlanList = findPlanList.pop()?.planList as number[];
        deletePlanList = deletePlanList.filter((plan) => plan != planId);

        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: from,
            planDate,
          },
          {
            planList: deletePlanList,
          },
        );

        //* 순서 이동 후 planList에 최종 배열 업데이트
        await this.planOrderRepository.update(
          {
            user_id: userId,
            type: to,
            planDate,
          },
          {
            planList: lastArray,
          },
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
